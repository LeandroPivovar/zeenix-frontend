<template>
    <div class="copy-trading-config">
      <!-- Card 1: Selecionar Trader -->
      <div class="card">
        <h3 class="card-title">
          Selecionar Trader
          <TooltipsCopyTraders>
            <h4>Trader</h4>
            <p>O Trader que você está copiando atualmente.</p>
          </TooltipsCopyTraders>
        </h3>
        <input 
          type="text" 
          class="search-input" 
          placeholder="🔍 Busque por nome ou ID do trader..."
          v-model="searchQuery"
        >
        <div class="empty-state">
          <div class="empty-icon">+</div>
          <p>Nenhum trader selecionado</p>
          <small>Clique no campo acima para escolher</small>
        </div>
      </div>
  
      <!-- Card 2: Configurações do Copy -->
      <div class="card">
        <h3 class="card-title">Configurações do Copy</h3>
        
        <div class="form-group">
          <label class="form-label">
            Tipo de Alocação
            <TooltipsCopyTraders>
              <div class="section-title">Proporção (%)</div>
              <p>Replica a mesma porcentagem de risco usada pelo Trader Mestre em cada operação.</p>
              <p>Se o mestre entrar com 2% do saldo dele, você também entra com 2% do seu saldo.</p>
              <hr>
              <div class="section-title">Valor Fixo ($)</div>
              <p>Replica exatamente o mesmo valor financeiro que o Trader Mestre usa.</p>
              <p>Se o mestre entrar com $5, sua conta também entra com $5, independentemente do seu saldo total.</p>
              <p class="highlight">Use valores moderados para evitar risco excessivo.</p>
            </TooltipsCopyTraders>
          </label>
          <div class="button-group">
            <button 
              :class="{ active: allocationType === 'percentage' }" 
              @click="allocationType = 'percentage'"
            >
              Proporção (%)
            </button>
            <button 
              :class="{ active: allocationType === 'fixed' }" 
              @click="allocationType = 'fixed'"
            >
              Valor Fixo ($)
            </button>
          </div>
        </div>
  
        <div class="form-group">
          <label class="form-label">
            Alavancagem
            <TooltipsCopyTraders>
              <h4>Alavancagem</h4>
              <p>Mostra o multiplicador aplicado às suas entradas em relação ao Trader Mestre.</p>
              <p class="example">Exemplo:</p>
              <p>Se o trader abre $10 e sua alavancagem é 2x, sua entrada será $20.</p>
              <p class="caution">Use com cautela — aumenta tanto os ganhos quanto as perdas.</p>
            </TooltipsCopyTraders>
          </label>
          <select v-model="leverage">
            <option>1x</option>
            <option>2x</option>
            <option>5x</option>
            <option>10x</option>
          </select>
        </div>
  
        <div class="form-group">
          <label class="form-label">
            Stop Loss
            <TooltipsCopyTraders>
              <h4>Stop Loss</h4>
              <p>Valor máximo de perda total que sua conta pode sofrer antes que o Copy Trading seja pausado.</p>
              <p>Configurado aqui como um valor fixo, mas poderia ser percentual dependendo da regra de negócio.</p>
            </TooltipsCopyTraders>
          </label>
          <input type="text" v-model="stopLoss">
        </div>
  
        <div class="form-group">
          <label class="form-label">
            Take Profit
            <TooltipsCopyTraders>
              <h4>Take Profit</h4>
              <p>Meta de lucro para encerrar o Copy automaticamente.</p>
              <p>Quando este valor é alcançado, o sistema pausa as operações.</p>
            </TooltipsCopyTraders>
          </label>
          <input type="text" v-model="takeProfit">
        </div>
  
        <div class="toggle-wrapper">
          <div class="toggle-info">
            <h4>
              Stop Loss Blindado
              <TooltipsCopyTraders>
                <h4>Stop Loss Blindado</h4>
                <p>Proteção avançada contra séries de perdas consecutivas.</p>
                <p>Mesmo que o Trader Mestre continue operando, sua conta é bloqueada ao detectar comportamento arriscado.</p>
              </TooltipsCopyTraders>
            </h4>
            <p>Protege contra operações consecutivas fora do padrão</p>
          </div>
          <label class="toggle">
            <input type="checkbox" v-model="armoredStopLossActive">
            <span class="slider"></span>
          </label>
        </div>
      </div>
  
      <!-- Card 3: Resumo da Configuração -->
      <div class="card">
        <h3 class="card-title">Resumo da Configuração</h3>
        
        <div class="summary-item">
          <span class="label">
            Trader
            <TooltipsCopyTraders>
              <h4>Trader</h4>
              <p>Mostra o Trader Mestre atualmente selecionado.</p>
            </TooltipsCopyTraders>
          </span>
          <span class="value">{{ selectedTraderName }}</span>
        </div>
  
        <div class="summary-item">
          <span class="label">
            Alocação
            <TooltipsCopyTraders>
              <h4>Alocação</h4>
              <p>Indica se você está copiando em Porcentagem (%) ou Valor Fixo ($).</p>
            </TooltipsCopyTraders>
          </span>
          <span class="value">{{ allocationType === 'percentage' ? 'Porcentagem %' : 'Valor Fixo $' }}</span>
        </div>
  
        <div class="summary-item">
          <span class="label">
            Alavancagem
            <TooltipsCopyTraders>
              <h4>Alavancagem</h4>
              <p>A alavancagem multiplica proporcionalmente o valor das suas operações em relação ao Trader Mestre.</p>
            </TooltipsCopyTraders>
          </span>
          <span class="value">{{ leverage }}</span>
        </div>
  
        <div class="summary-item">
          <span class="label">
            Stop Loss
            <TooltipsCopyTraders>
              <h4>Stop Loss</h4>
              <p>Valor máximo de perda permitido antes do Copy encerrar as operações automaticamente.</p>
            </TooltipsCopyTraders>
          </span>
          <span class="value red">{{ stopLoss }}</span>
        </div>
  
        <div class="summary-item">
          <span class="label">
            Take Profit
            <TooltipsCopyTraders>
              <h4>Take Profit</h4>
              <p>Meta diária de lucro. Quando alcançada, o Copy é pausado para garantir o ganho.</p>
            </TooltipsCopyTraders>
          </span>
          <span class="value green">{{ takeProfit }}</span>
        </div>
  
        <div class="summary-item">
          <span class="label">
            Proteção
            <TooltipsCopyTraders>
              <h4>Proteção</h4>
              <p>O Stop Loss Blindado protege contra perdas consecutivas.</p>
            </TooltipsCopyTraders>
          </span>
          <span :class="['value', { green: armoredStopLossActive, red: !armoredStopLossActive }]">
            {{ armoredStopLossActive ? 'Ativa' : 'Inativa' }}
          </span>
        </div>
  
        <div class="status-badge">
          <span class="status-dot"></span>
          <div class="status-text">
            <strong>Aguardando Ativação</strong>
            <small>O Copy será iniciado após você confirmar</small>
          </div>
        </div>
  
        <button class="activate-btn" @click="activateCopy">ATIVAR COPY</button>
  
        <p class="warning-text">
          <span class="highlight">Aviso:</span> O Copy está configurado para operar com 
          <span class="highlight">risco controlado</span>. Verifique as configurações antes de ativar.
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import TooltipsCopyTraders from '../TooltipsCopyTraders.vue';
  
  export default {
    name: 'CopyTradingConfig',
    components: {
      TooltipsCopyTraders,
    },
    data() {
      return {
        searchQuery: '',
        selectedTraderName: 'TraderMaster',
        allocationType: 'percentage',
        leverage: '1x',
        stopLoss: '$250',
        takeProfit: '$500',
        armoredStopLossActive: true,
      };
    },
    methods: {
      activateCopy() {
        const config = {
          trader: this.selectedTraderName,
          allocationType: this.allocationType,
          leverage: this.leverage,
          stopLoss: this.stopLoss,
          takeProfit: this.takeProfit,
          armoredStopLoss: this.armoredStopLossActive,
        };
        
        console.log('Ativando Copy Trading com configurações:', config);
        alert(`Copy Trading Ativado!\n\nTrader: ${config.trader}\nAlocação: ${config.allocationType === 'percentage' ? 'Porcentagem' : 'Valor Fixo'}\nAlavancagem: ${config.leverage}`);
      },
    },
  };
  </script>
  
  <style scoped>
  .copy-trading-config {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
  }
  
  /* --- Card --- */
  .card {
    background: #111;
    border: 1px solid #222;
    border-radius: 8px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  
  .card-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  /* --- Form Elements --- */
  .search-input {
    width: 100%;
    background: #0a0a0a;
    border: 1px solid #222;
    border-radius: 6px;
    padding: 12px 16px;
    color: #fff;
    font-size: 14px;
    margin-bottom: 20px;
  }
  
  .search-input::placeholder {
    color: #555;
  }
  
  .search-input:focus {
    outline: none;
    border-color: #4ade80;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #aaa;
    margin-bottom: 8px;
  }
  
  .button-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    border-radius: 6px;
    overflow: hidden;
  }
  
  .button-group button {
    background: #1a1a1a;
    border: 1px solid #222;
    color: #888;
    padding: 12px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s;
  }
  
  .button-group button.active {
    background: #16a34a;
    color: #fff;
    border-color: #16a34a;
  }
  
  .button-group button:hover:not(.active) {
    background: #252525;
  }
  
  select, input[type="text"] {
    width: 100%;
    background: #0a0a0a;
    border: 1px solid #222;
    border-radius: 6px;
    padding: 12px;
    color: #fff;
    font-size: 14px;
  }
  
  select:focus, input[type="text"]:focus {
    outline: none;
    border-color: #4ade80;
  }
  
  /* --- Empty State --- */
  .empty-state {
    background: #0a0a0a;
    border: 1px dashed #333;
    border-radius: 8px;
    padding: 40px 20px;
    text-align: center;
  }
  
  .empty-icon {
    width: 60px;
    height: 60px;
    background: #1a1a1a;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    font-size: 32px;
    color: #333;
  }
  
  .empty-state p {
    color: #fff;
    margin-bottom: 4px;
    font-size: 14px;
  }
  
  .empty-state small {
    color: #666;
    font-size: 13px;
  }
  
  /* --- Toggle Switch --- */
  .toggle-wrapper {
    background: #0a0a0a;
    border: 1px solid #222;
    border-radius: 6px;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }
  
  .toggle-info h4 {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .toggle-info p {
    font-size: 12px;
    color: #666;
    width: 90%;
  }
  
  .toggle {
    position: relative;
    width: 50px;
    height: 24px;
  }
  
  .toggle input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #333;
    transition: .4s;
    border-radius: 24px;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + .slider {
    background-color: #16a34a;
  }
  
  input:checked + .slider:before {
    transform: translateX(26px);
  }
  
  /* --- Summary Card --- */
  .summary-item {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #222;
    font-size: 14px;
  }
  
  .summary-item:last-of-type {
    border-bottom: none;
  }
  
  .summary-item .label {
    color: #a5a5a5;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .summary-item .value {
    font-weight: 500;
  }
  
  .value.red {
    color: #ef4444;
  }
  
  .value.green {
    color: #4ade80;
  }
  
  .status-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #0a0a0a;
    border: 1px solid #333;
    border-radius: 6px;
    padding: 16px;
    margin: 20px 0;
  }
  
  .status-dot {
    width: 8px;
    height: 8px;
    background: #fbbf24;
    border-radius: 50%;
    animation: pulse-dot 2s infinite;
  }
  
  @keyframes pulse-dot {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }
  
  .status-text {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
    flex: 1;
  }
  
  .status-text strong {
    display: block;
    color: #fbbf24;
    font-size: 14px;
    margin-bottom: 4px;
  }
  
  .status-text small {
    color: #666;
    font-size: 12px;
  }
  
  .activate-btn {
    width: 100%;
    background: #16a34a;
    border: none;
    color: #fff;
    padding: 16px;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 16px;
    transition: background 0.3s;
  }
  
  .activate-btn:hover {
    background: #15803d;
  }
  
  .activate-btn:active {
    transform: scale(0.98);
  }
  
  .warning-text {
    font-size: 12px;
    color: #666;
    text-align: center;
    line-height: 1.5;
  }
  
  .warning-text .highlight {
    color: #4ade80;
    font-weight: 500;
  }
  
  /* Responsive */
  @media (max-width: 1400px) {
    .copy-trading-config {
      grid-template-columns: 1fr 1fr;
    }
  }
  
  @media (max-width: 900px) {
    .copy-trading-config {
      grid-template-columns: 1fr;
    }
  }
  </style>