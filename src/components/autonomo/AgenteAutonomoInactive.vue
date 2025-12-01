<template>
  <div class="layout-content-agent-autonomo">
    <div class="agent-config-container">
      <header class="config-header">
        <h1>Configuração do Agente Autônomo</h1>
        <p>Configure uma única vez. O agente operará todos os dias até atingir suas metas.</p>
      </header>
      <div class="container-sections">
        <!-- Seção Mercado -->
        <section class="config-section config-desktop">
          <h2 class="section-with-tooltip">
            Mercado
            <div class="tooltip-container">
              <svg class="icon-help" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span class="tooltip-text">Escolha o ativo que deseja operar.</span>
            </div>
          </h2>
          <!-- Cards para Desktop/Tablet -->
          <div class="market-options options-grid desktop-only">
            <div 
              class="option-card"
              :class="{ 'selected': selectedMarket === 'volatility_10' }"
              @click="selectMarket('volatility_10')"
            >
              <h3>Volatility 10 Index</h3>
              <p>Mercado com volatilidade constante de 10%.</p>
            </div>
            <div 
              class="option-card"
              :class="{ 'selected': selectedMarket === 'volatility_25' }"
              @click="selectMarket('volatility_25')"
            >
              <h3>Volatility 25 Index</h3>
              <p>Mercado com volatilidade constante de 25%.</p>
            </div>
            <div 
              class="option-card"
              :class="{ 'selected': selectedMarket === 'volatility_50' }"
              @click="selectMarket('volatility_50')"
            >
              <h3>Volatility 50 Index</h3>
              <p>Mercado com volatilidade constante de 50%.</p>
            </div>
            <div 
              class="option-card"
              :class="{ 'selected': selectedMarket === 'volatility_75' }"
              @click="selectMarket('volatility_75')"
            >
              <h3>Volatility 75 Index</h3>
              <p>Mercado com volatilidade constante de 75%.</p>
            </div>
            <div 
              class="option-card"
              :class="{ 'selected': selectedMarket === 'volatility_100' }"
              @click="selectMarket('volatility_100')"
            >
              <h3>Volatility 100 Index</h3>
              <p>Mercado com volatilidade constante de 100%.</p>
            </div>
          </div>
          <!-- Select para Mobile -->
          <div class="market-options mobile-only">
            <select v-model="selectedMarket" class="mobile-select">
              <option value="volatility_10">Volatility 10 Index</option>
              <option value="volatility_25">Volatility 25 Index</option>
              <option value="volatility_50">Volatility 50 Index</option>
              <option value="volatility_75">Volatility 75 Index</option>
              <option value="volatility_100">Volatility 100 Index</option>
            </select>
          </div>
        </section>

        <!-- Seção Estratégias Disponíveis -->
        <section class="config-section">
          <h2>Estratégias Disponíveis</h2>
          <!-- Cards para Desktop/Tablet -->
          <div class="strategies-options options-grid desktop-only">
            <div 
              class="option-card"
              :class="{ 'selected': selectedStrategy === 'arion' }"
              @click="selectStrategy('arion')"
              title="Selecione uma estratégia de operação."
            >
              <h3>Arion</h3>
              <p>Microtransações rápidas e alta responsabilidade.</p>
            </div>
            <div 
              class="option-card"
              :class="{ 'selected': selectedStrategy === 'cryptomax' }"
              @click="selectStrategy('cryptomax')"
              title="Selecione uma estratégia de operação."
            >
              <h3>CryptoMax</h3>
              <p>Ideal para cripto com volatilidade elevada.</p>
            </div>
            <div 
              class="option-card"
              :class="{ 'selected': selectedStrategy === 'orion_ultra' }"
              @click="selectStrategy('orion_ultra')"
              title="Selecione uma estratégia de operação."
            >
              <h3>Orion Ultra</h3>
              <p>Confirmação tripla com filtros inteligentes.</p>
            </div>
            <div 
              class="option-card"
              :class="{ 'selected': selectedStrategy === 'metaflow' }"
              @click="selectStrategy('metaflow')"
              title="Selecione uma estratégia de operação."
            >
              <h3>MetaFlow</h3>
              <p>Otimizada para os ciclos dos metais.</p>
            </div>
          </div>
          <!-- Select para Mobile -->
          <div class="strategies-options mobile-only">
            <select v-model="selectedStrategy" class="mobile-select">
              <option value="arion">Arion</option>
              <option value="cryptomax">CryptoMax</option>
              <option value="orion_ultra">Orion Ultra</option>
              <option value="metaflow">MetaFlow</option>
            </select>
          </div>
        </section>

        <!-- NOVA SEÇÃO: Modo de Negociação -->
        <section class="config-section trade-mode-section">
          <h2>Modo de Negociação</h2>
          <div class="trade-mode-options options-grid">
            <div 
              class="option-card"
              :class="{ 'selected': selectedTradeMode === 'fast' }"
              @click="selectTradeMode('fast')"
              title="Selecione a velocidade de operação."
            >
              <h3>Rápido</h3>
              <p>Operações de alta frequência.</p>
            </div>
            <div 
              class="option-card"
              :class="{ 'selected': selectedTradeMode === 'moderate' }"
              @click="selectTradeMode('moderate')"
              title="Selecione a velocidade de operação."
            >
              <h3>Moderado</h3>
              <p>Equilíbrio entre frequência e análise.</p>
            </div>
            <div 
              class="option-card"
              :class="{ 'selected': selectedTradeMode === 'slow' }"
              @click="selectTradeMode('slow')"
              title="Selecione a velocidade de operação."
            >
              <h3>Lento</h3>
              <p>Foco em operações de longo prazo.</p>
            </div>
          </div>
        </section>

        <!-- Seção Nível de Risco -->
        <section class="config-section risk-section">
          <h2>Nível de Risco</h2>
          <div class="risk-options">
            <div 
              class="option-card"
              :class="{ 'selected': selectedRisk === 'conservative' }"
              @click="selectRisk('conservative')"
              title="Selecione o seu perfil de risco."
            >
              <h3>Conservador</h3>
              <p>Baixo risco, retornos estáveis</p>
            </div>
            <div 
              class="option-card"
              :class="{ 'selected': selectedRisk === 'balanced' }"
              @click="selectRisk('balanced')"
              title="Selecione o seu perfil de risco."
            >
              <h3>Equilibrado</h3>
              <p>Risco moderado, bom equilíbrio</p>
            </div>
            <div 
              class="option-card"
              :class="{ 'selected': selectedRisk === 'aggressive' }"
              @click="selectRisk('aggressive')"
              title="Selecione o seu perfil de risco."
            >
              <h3>Agressivo</h3>
              <p>Alto risco, maiores retornos</p>
            </div>
          </div>
        </section>

        <div class="footer-section">
          <!-- Seção Parâmetros Diários -->
          <section class="config-section daily-params-section">
            <h2>Parâmetros Diários</h2>
            <div class="daily-params-grid">
              <div class="param-input-group">
                <h3>Valor por operação</h3>
                <input 
                  type="number" 
                  v-model.number="valorOperacao" 
                  class="input-editable"
                  min="0.01"
                  step="0.01"
                >
                <p style="font-size: 0.8em; color: #777; margin-top: 5px;">{{ percentualValorOperacao }}% do capital total</p>
              </div>
              <div class="param-input-group">
                <h3>Meta diária de lucro</h3>
                <input 
                  type="number" 
                  v-model.number="metaLucro" 
                  class="input-editable"
                  min="0.01"
                  step="0.01"
                >
                <p style="font-size: 0.8em; color: #00ff66; margin-top: 5px;">+{{ percentualMetaLucro }}% do capital total</p>
              </div>
              <div class="param-input-group">
                <h3>Limite de perda do dia</h3>
                <input 
                  type="number" 
                  v-model.number="limitePerda" 
                  class="input-editable"
                  min="0.01"
                  step="0.01"
                >
                <p style="font-size: 0.8em; color: red; margin-top: 5px;">-{{ percentualLimitePerda }}% do capital total</p>
              </div>
            </div>
          </section>

          <!-- Seção Resumo da Configuração -->
          <section class="config-section summary-section">
            <h2>Resumo da Configuração</h2>
            <div class="summary-grid">
              <div class="summary-item market-item">
                <img src="../../assets/icons/stats-green.svg" alt="" width="15px" class="icon-sumary-risk">
                <div class="summary-item-value">
                  <span>Mercado</span>
                  <strong>{{ getMarketTitle(selectedMarket) }}</strong>
                </div>
              </div>
              <div class="summary-item value-per-op">
                <svg class="icon-value-op" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M15 8.44c-.58 0-1.2-.35-1.78-.9-.67-.62-1.3-.77-2.02-.77-1.15 0-2.08.76-2.08 1.96 0 1.25.75 1.83 2.05 2.5.9.48 1.77.8 2.37 1.15 1.4.82 2.3 1.8 2.3 3.3 0 1.8-1.1 2.8-2.6 2.8-.82 0-1.6-.26-2.4-.76-.73-.46-1.5-.7-2.15-.7"></path><path d="M12 4v16"></path></svg>
                <div class="summary-item-value">
                  <span>Valor por operação</span>
                  <strong>${{ valorOperacaoNumero.toFixed(2) }}</strong>
                </div>
              </div>
              <div class="summary-item strategy-item">
                <svg class="icon-summary-strategy" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                <div class="summary-item-value">
                  <span>Estratégia</span>
                  <strong>{{ getStrategyTitle(selectedStrategy) }}</strong>
                </div>
              </div>
              <div class="summary-item daily-goal">
                <span class="icon-sumary-risk icon-green ">↑</span> 
                <div class="summary-item-value">
                  <span>Meta diária</span>
                  <strong>${{ metaLucroNumero.toFixed(2) }}</strong>
                </div>
              </div>
              <div class="summary-item trade-mode-item">
                <svg class="icon-summary-trade-mode" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                <div class="summary-item-value">
                  <span>Modo de Negociação</span>
                  <strong>{{ getTradeModeTitle(selectedTradeMode) }}</strong>
                </div>
              </div>
              <div class="summary-item risk-item">
                <svg class="icon-summary-risk icon-green" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 18v-6"></path><path d="M17 12h5l-1-4h-5z"></path><path d="M7 12H2l1-4h5z"></path><path d="M12 2L9 6h6z"></path><path d="M19 19c-3.3 0-6 2-6 3h6"></path><path d="M5 19c3.3 0 6 2 6 3H5"></path></svg>
                <div class="summary-item-value">
                  <span>Nível de risco</span>
                  <strong>{{ getRiskTitle(selectedRisk) }}</strong>
                </div>
              </div>
              <div class="summary-item daily-loss">
                <span class="icon-sumary-risk icon-green">↓</span> 
                <div class="summary-item-value">
                  <span>Limite de perda</span>
                  <strong>${{ limitePerdaNumero.toFixed(2) }}</strong>
                </div>
              </div>
            </div>                    
            <button class="start-button" @click="iniciarAgente">
              INICIAR AGENTE
            </button>
            <footer class="config-footer">
              <p class="footer-text">
                Ao iniciar, você concorda que o agente operará de forma autônoma
                até que a meta diária seja atingida ou o limite de perda seja alcançado.
              </p>
            </footer>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AgenteAutonomoInactive',
  props: {
    accountBalance: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      selectedMarket: 'volatility_10', 
      selectedStrategy: 'arion',
      selectedRisk: 'balanced',
      selectedTradeMode: 'moderate', // Novo estado para o modo de negociação
      valorOperacao: 50.00,
      metaLucro: 100.00,
      limitePerda: 50.00,
    };
  },
  methods: {
    iniciarAgente() {
      const configData = {
        estrategia: this.getStrategyTitle(this.selectedStrategy),
        mercado: this.getMarketTitle(this.selectedMarket),
        risco: this.getRiskTitle(this.selectedRisk),
        modoNegociacao: this.getTradeModeTitle(this.selectedTradeMode), // Inclui o novo modo de negociação
        goalValue: this.metaLucroNumero,
        stopValue: this.limitePerdaNumero,
      };
      this.$emit('iniciar-agente', configData);
      this.$nextTick(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },
    selectMarket(marketId) {
      this.selectedMarket = marketId;
    },
    selectStrategy(strategyId) {
      this.selectedStrategy = strategyId;
    },
    selectRisk(riskId) {
      this.selectedRisk = riskId;
    },
    selectTradeMode(modeId) { // Novo método para selecionar o modo de negociação
      this.selectedTradeMode = modeId;
    },
    getMarketTitle(id) {
      const map = {
        'volatility_10': 'Volatility 10 Index',
        'volatility_25': 'Volatility 25 Index',
        'volatility_50': 'Volatility 50 Index', 
        'volatility_75': 'Volatility 75 Index',
        'volatility_100': 'Volatility 100 Index'
      };
      return map[id] || id;
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
    getTradeModeTitle(id) { // Novo método para obter o título do modo de negociação
      const map = {
        'fast': 'Rápido',
        'moderate': 'Moderado',
        'slow': 'Lento'
      };
      return map[id] || id;
    }
  },
  computed: {
    capitalTotal() {
      return Number(this.accountBalance) || 2500.00;
    },
    valorOperacaoNumero() {
      return Number(this.valorOperacao) || 0;
    },
    metaLucroNumero() {
      return Number(this.metaLucro) || 0;
    },
    limitePerdaNumero() {
      return Number(this.limitePerda) || 0;
    },
    percentualValorOperacao() {
      if (!this.capitalTotal || this.capitalTotal === 0) return '0.00';
      return ((this.valorOperacaoNumero / this.capitalTotal) * 100).toFixed(2);
    },
    percentualMetaLucro() {
      if (!this.capitalTotal || this.capitalTotal === 0) return '0.00';
      return ((this.metaLucroNumero / this.capitalTotal) * 100).toFixed(2);
    },
    percentualLimitePerda() {
      if (!this.capitalTotal || this.capitalTotal === 0) return '0.00';
      return ((this.limitePerdaNumero / this.capitalTotal) * 100).toFixed(2);
    }
  },
  watch: {
    valorOperacao() {},
    metaLucro() {},
    limitePerda() {}
  }
}
</script>

<style scoped>
/* Estilos Gerais */
.layout-content-agent-autonomo {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.agent-config-container {
  background: #0e0f0f;
  border-radius: 12px;
  border: 1px solid #1C1C1C;
  padding: 20px;
}

.config-header h1 {
  font-size: 1.8em;
  margin-bottom: 5px;
  text-align: left;
  color: white;
  font-weight: 600;
}
.config-header p {
  color: #b0b0b0;
  font-size: 0.9em;
  padding-bottom: 30px;
  text-align: left;
}

.container-sections {
  padding: 0px;
  margin-top: 0;
  background: #0e0f0f;
  border-radius: 12px;
  border: 1px solid #1C1C1C;
}

.config-section {
  padding: 20px;
  border-radius: 12px;
}

.config-section h2 {
  font-size: 1.1em;
  margin-bottom: 15px;
  font-weight: 500;
  color: #e0e0e0;
  text-align: left;
}
.config-section h3 {
  color: white;
}

/* Tooltip */
.section-with-tooltip {
  display: flex;
  align-items: center;
  justify-content: space-between; 
  padding-top: 25px; 
  padding-right: 10px; 
  margin-top: -25px; 
}
.tooltip-container {
  position: relative; 
  display: inline-block;
  cursor: help; 
}
.icon-help {
  width: 16px; 
  height: 16px;
  color: #999; 
  transition: color 0.2s;
}
.icon-help:hover {
  color: #fff; 
}
.tooltip-text {
  visibility: hidden;
  opacity: 0;
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  width: max-content; 
  position: absolute;
  z-index: 10; 
  top: 50%; 
  right: 100%; 
  transform: translateY(-50%) translateX(-10px); 
  transition: opacity 0.3s;
  pointer-events: none; 
  white-space: nowrap; 
}
.tooltip-container:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

/* Cards de Opção (Mercado, Estratégia, Risco, Modo de Negociação) */
.options-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); 
  gap: 12px;
}
.strategies-options.options-grid {
  grid-template-columns: repeat(4, 1fr);
}
.risk-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.trade-mode-options { /* Novo estilo para o grid do modo de negociação */
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.option-card {
  background-color: #0d0c0c;
  border: 1px solid #333;
  padding: 15px 15px;
  border-radius: 6px;
  transition: all 0.2s;
  cursor: pointer;
  min-height: 90px;
  display: flex;
  flex-direction: column;
  text-align: left;
}
.option-card:hover:not(.selected) {
  border-color: #555;
  background-color: #1a1a1a;
}
.option-card.selected {
  border: 1px solid #00ff66; 
  background-color: #19723b25;
}
.option-card h3 {
  font-size: 0.95em;
  font-weight: 600;
  margin-bottom: 10px;
  margin-top: 5px;
}
.option-card p {
  font-size: 0.8em;
  color: #999;
  line-height: 1.3;
}
.risk-options .option-card,
.trade-mode-options .option-card { /* Centraliza o texto nos cards de risco e modo de negociação */
  text-align: center;
  align-items: center;
  justify-content: center;
}
.risk-options .option-card h3,
.trade-mode-options .option-card h3 {
  margin-top: 5px; 
}

/* Selects para Mobile */
.mobile-select {
  width: 100%;
  padding: 10px 12px;
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-radius: 4px;
  color: #fff;
  font-size: 1em;
  appearance: none; /* Remove o estilo padrão do sistema */
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%20viewBox%3D%220%200%20292.4%20292.4%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M287%20197.9l-13.9-13.9c-3.7-3.7-9.8-3.7-13.5%200L146.2%20272.2%2032.8%20158.8c-3.7-3.7-9.8-3.7-13.5%200L5.4%20172.7c-3.7%203.7-3.7%209.8%200%2013.5l133.3%20133.3c3.7%203.7%209.8%203.7%2013.5%200l133.3-133.3c3.7-3.6%203.7-9.7%200-13.4z%22%2F%3E%3C%2Fsvg%3E'); /* Seta customizada */
  background-repeat: no-repeat;
  background-position: right 10px top 50%;
  background-size: 12px;
  cursor: pointer;
}

/* Parâmetros Diários */
.daily-params-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 700px;
  min-width: 400px;
}
.param-input-group h3 {
  font-size: 0.8em;
  color: #999;
  margin-bottom: 8px;
  font-weight: 500;
}
.param-input-group {
  width: 100%;
  text-align: left;
}
.input-editable {
  background-color: #1a1a1a;
  border: 1px solid #333;
  padding: 10px 12px;
  border-radius: 4px;
  font-size: 1.0em;
  font-weight: bold;
  text-align: left;
  color: #fff;
  height: 40px; 
  line-height: 20px;
  width: 100%;
  box-sizing: border-box; 
  -moz-appearance: textfield; 
  appearance: textfield;
}
.input-editable::-webkit-outer-spin-button,
.input-editable::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Resumo da Configuração */
.summary-section {
  padding: 25px;
  margin: auto;
  display: flex;
  flex-direction: column;
  margin: 0;
  max-width: 700px;
}
.summary-grid {
  margin: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px 40px;
}
.summary-item {
  display: flex;
  align-items: center;
  font-size: 0.9em;
  text-align: left;
  width: 100%;
  justify-content: flex-start;
}
.summary-item-value {
  display: flex; 
  align-items: flex-start;
  flex-direction: column;
  text-align: left;
  width: 100%;
}
.summary-item.value-per-op, 
.summary-item.daily-goal, 
.summary-item.daily-loss {
  max-width: 200px;
}
.summary-item svg, .summary-item i {
  width: 16px; 
  height: 16px;
  color: #00ff66; 
  margin-right: 10px;
}
.summary-item span {
  margin-right: 5px;
  white-space: nowrap;
  color: #858585;
}
.summary-item strong {
  font-weight: bold;
  color: #fff;
  white-space: nowrap;
}
.icon-green {
  color: #00ff66 !important;
}
span.icon-sumary-risk {
  font-size: 25px;
  color: #045826;
}

/* Botão */
.start-button {
  width: 100%;
  padding: 15px;
  background-color: #22C55E;
  color: #000000;
  border: none;
  border-radius: 8px;
  font-size: 1.0em;
  font-weight: bold;
  cursor: pointer;
  letter-spacing: 1px;
  transition: background-color 0.2s;
  margin-top: 20px;
  max-width: 550px;
  margin-right: auto;
}
.start-button:hover {
  background-color: #1ca14d;
}

/* Rodapé */
.config-footer {
  text-align: center;
  font-size: 0.9em;
  color: #888;
  padding: 10px 20px;
  line-height: 1.4;
  display: flex;
  justify-content: center;
}
.footer-text {
  width: 90%;
  text-align: center;
  margin-top: 10px;
}

/* Responsividade */
/* Esconde selects no desktop e cards no mobile */
.desktop-only { display: block; }
.mobile-only { display: none; }

@media (max-width: 1200px) {
  .options-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 800px) {
  .options-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .daily-params-grid {
    min-width: unset; /* Remove min-width para mobile */
  }
  .footer-section {
    flex-direction: column; /* Empilha seções no mobile */
    gap: 20px;
  }
  .summary-section {
    max-width: 100%; /* Ocupa toda a largura disponível */
  }
  .start-button {
    max-width: 100%; /* Ocupa toda a largura disponível */
  }
}

@media (max-width: 700px) {
  .summary-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .summary-item.value-per-op, 
  .summary-item.daily-goal, 
  .summary-item.daily-loss {
    justify-content: flex-start; 
    max-width: 100%; /* Ajusta para ocupar a largura total */
  }
}

@media (max-width: 600px) {
  .daily-params-grid {
    flex-direction: column;
    gap: 15px;
  }
  .options-grid {
    grid-template-columns: 1fr; /* Um card por linha em telas muito pequenas */
  }
  .desktop-only { display: none; } /* Esconde cards em mobile */
  .mobile-only { display: block; } /* Mostra selects em mobile */

  /* Ajustes para os selects em mobile */
  .market-options, .strategies-options {
    margin-bottom: 20px; /* Espaçamento entre os selects */
  }
  .mobile-select {
    margin-top: 10px; /* Espaçamento do título */
  }
}

@media (min-width: 1600px){
  .daily-params-grid {
    max-width: 700px;
    min-width: 700px;
  }
  .footer-text{
    width: 90%;
    margin-right: 100px;
  }
}
</style>
