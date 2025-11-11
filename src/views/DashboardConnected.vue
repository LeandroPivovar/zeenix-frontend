<template>
  <main class="dash-content">
    <div class="cards">
      <!-- Card de Saldo -->
      <div class="balance-card">
        <div class="row">
          <div class="dot"></div>
          <div class="metric">
            <div class="label">Saldo Atual</div>
            <div class="value">{{ formattedBalance }}</div>
          </div>
          <div class="metric right">
            <div class="label">Potencial mensal estimado</div>
            <div class="value green">+{{ preferredCurrencyPrefix }}{{ potentialValue }}/mês <span class="desktop-value-span">(com IA ativa)</span> <span class="mobile-value-span">IA ativa</span></div>
          </div>
          <div class="spacer"></div>
          <button class="cta">
            <img src="../assets/icons/add-black.svg" alt="Aumentar minha banca" class="icon-dashboard">
            Aumentar minha banca
          </button>
        </div>
        <div class="hint">Capital ocioso é lucro desperdiçado. Mantenha sua IA abastecida.</div>
      </div>

      <!-- Card de Nível -->
      <div class="level-card">
        <div class="box">
          <div class="box-feature">
            <span class="icon-feature">🎯</span>
            <div class="box-level">
              <div class="title">Nível de investidor: <strong>Bronze <img src="../assets/icons/bronze-medal.svg" alt="" class="medal-icon"> </strong> → Próximo: <strong>Silver <img src="../assets/icons/silver-medal.svg" alt="" class="medal-icon"> </strong></div>
              <div class="subtitle">Faltam $320 de saldo para desbloquear novos limites.</div>
            </div> 
          </div>
          <div class="sub-text">Depósitos maiores liberam novas IAs e multiplicam o limite de operações</div>
        </div>
        <div class="spacer"></div>
        <button class="link">Ver benefícios do próximo nível</button>
      </div>

      <!-- Features Grid -->
      <div class="features">
        <div class="feature">
          <div class="f-img"><span class="icon-feature">🧠</span></div>
          <div class="f-title">IA de Investimento</div>
          <div class="f-sub">Sua IA opera 24h — quanto mais saldo, mais potencial.</div>
          <div class="f-text">A IA trabalha para você. Quanto maior o capital, mais oportunidades ela aproveita</div>
          <button class="f-btn">Ativar IA Agora</button>
        </div>
        <div class="feature">
          <div class="f-img"><span class="icon-feature">👥</span></div>
          <div class="f-title">Copy Trading</div>
          <div class="f-sub">Lucro com quem já vence.</div>
          <div class="f-text">++1.372 usuários ativos hoje replicando traders verificados</div>
          <button class="f-btn">Escolher Trader</button>
        </div>
        <div class="feature">
          <div class="f-img"><span class="icon-feature">⚙️</span></div>
          <div class="f-title">Operação Manual</div>
          <div class="f-sub">Controle o mercado nas suas mãos.</div>
          <div class="f-text">Analise, opere e maximize seu potencial - o saldo ativo define seu alcance</div>
          <button class="f-btn">Operar Agora</button>
        </div>
      </div>

      <!-- Projeção de Ganhos -->
      <div class="projection">
        <div class="p-title">
          <span>📈</span>
          Potencial de Ganhos (Projeção Futura)
        </div>
        <div class="p-sub">Com seu saldo atual de {{ formattedBalance }}, sua IA Orion pode gerar até <span class="green">+{{ preferredCurrencyPrefix }}{{ potentialValue }}/mês</span></div>
        <div class="p-subtext">Com +$500 de depósito, o potencial sobe para <span class="yellow">+$2.780/mês</span></div>
        <div class="p-saldo">
          <div class="p-saldo-atual">Atual: $2.180</div>
          <div class="spacer"></div>
          <div class="p-saldo-projetado">Com 500 + 2180</div>
        </div>
        <button class="projection-btn">
          <img src="../assets/icons/up-arrow.svg" alt="" class="icon-dashboard">
          Aumentar Capital e Liberar Potencial
        </button>
      </div>

      <!-- Comunidade -->
      <div class="community">
        <div class="c-title">
          <span>🌍</span>
          Comunidade Zenix Black Hoje
        </div>
        <div class="c-cards">
          <div class="c-card">
            <h2 class="c-card-title">+1.372</h2>
            <h4>usuários ativos</h4>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" style="width: 70%;"></div> 
            </div>
          </div>
          <div class="c-card">
            <h2 class="c-card-title">$184.000</h2>
            <h4>depositados nas últimas 24h</h4>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" style="width: 80%;"></div> 
            </div>
          </div>
          <div class="c-card">
            <h2 class="c-card-title">+248</h2>
            <h4>Novas ativações de IA</h4>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" style="width: 80%;"></div> 
            </div>
          </div>
        </div>
        <div class="c-footer">
          <h3>Você faz parte da elite que lucra em dolar. Amplie seu capital e avance de nível.</h3>
        </div>
      </div>

      <!-- Desafio Diário -->
      <div class="daily-challenge-card">
        <div class="challenge-header">
          <span class="icon-dashboard">🎯</span>
          <div class="challenge-title">Desafio Diário Zenix</div>
        </div>

        <div class="challenge-list">
          <div class="challenge-item complete">
            <div class="challenge-status-icon">
                <div class="check-box checked">
                    <span class="check-mark">✔</span>
                </div>
            </div>
            <span>Acessou o Dashboard</span>
            <span class="challenge-action-text green">Completo</span>
          </div>

          <div class="challenge-item" :class="{ 'complete': challenges.deposit }">
            <div class="challenge-status-icon">
                <div class="check-box" :class="{ 'checked': challenges.deposit }">
                    <span v-if="challenges.deposit" class="check-mark">✔</span>
                </div>
            </div>
            <span>Fez novo depósito</span>
            <button v-if="!challenges.deposit" class="f-btn action-btn" @click="completeChallenge('deposit')">Fazer agora</button>
            <span v-else class="challenge-action-text green">Completo</span>
          </div>

          <div class="challenge-item no-border" :class="{ 'complete': challenges.activateAI }">
            <div class="challenge-status-icon">
                <div class="check-box" :class="{ 'checked': challenges.activateAI }">
                    <span v-if="challenges.activateAI" class="check-mark">✔</span>
                </div>
            </div>
            <span>Ativou uma IA hoje</span>
            <button v-if="!challenges.activateAI" class="f-btn action-btn" @click="completeChallenge('activateAI')">Ativar</button>
            <span v-else class="challenge-action-text green">Completo</span>
          </div>
        </div>

        <div class="challenge-progress-container">
            <div 
                class="challenge-progress-fill" 
                :style="{ width: challengeProgress + '%' }"
            ></div>
        </div>
        
        <div class="challenge-footer">
          Consistência é a chave para liberar novos bônus.
        </div>
      </div>

      <!-- Gráficos de Performance -->
      <div class="graphic-cards">
        <div class="g-card">
          <h2 class="g-card-title">IA de investimento</h2>
          <h4 class="g-card-subtitle">+$450 (6,2%)</h4>
          <div class="graphic">
            <LineChart 
              chartId="chart-ai" 
              :data="chartDataAI"
              color="#10B981"
              :height="80"
            />
          </div>
        </div>
        <div class="g-card">
          <h2 class="g-card-title">Copy Trading</h2>
          <h4 class="g-card-subtitle">+$380 (5,1%)</h4>
          <div class="graphic">
            <LineChart 
              chartId="chart-copy" 
              :data="chartDataCopy"
              color="#10B981"
              :height="80"
            />
          </div>
        </div>
        <div class="g-card">
          <h2 class="g-card-title">Operação Manual</h2>
          <h4 class="g-card-subtitle">+$120 (2,8%)</h4>
          <div class="graphic">
            <LineChart 
              chartId="chart-manual" 
              :data="chartDataManual"
              color="#10B981"
              :height="80"
            />
          </div>
        </div>
      </div>

      <!-- Melhores IAs -->
      <div class="best-ias-card">
        <div class="best-ias-header">
          <span class="icon-feature">🔥</span>
          <h2 class="best-ias-title">Melhores IAs Agora</h2>
        </div>
        <p class="best-ias-subtitle">As IAs que mais lucraram nas últimas 24h</p>
        
        <ul class="ias-list">
          <li class="ia-item" v-for="(ia, index) in topIAs" :key="index">
            <div class="ia-info">
              <span>🤖</span>
              <span class="ia-name">{{ ia.name }}</span>
            </div>
            <div class="ia-performance">
              <span class="ia-value green">+${{ ia.value }}</span>
              <span class="ia-percentage">({{ ia.percentage }}%)</span>
            </div>
            <button class="f-btn ia-activate-btn">Ativar</button>
          </li>
        </ul>
      </div>

    </div>
  </main>
</template>

<script>
import LineChart from '../components/LineChart.vue'

export default {
  name: 'DashboardConnected',
  components: {
    LineChart
  },
  props: { 
    info: { 
      type: Object, 
      required: true 
    } 
  },
  data() {
    return {
      // Desafios
      challenges: {
        deposit: false,
        activateAI: false,
      },
      totalChallenges: 3,
      
      // Dados dos gráficos
      chartDataAI: [3200, 3350, 3280, 3420, 3550, 3480, 3650, 3720, 3650, 3800, 3850, 3920, 4050, 4120, 4280, 4350, 4520, 4650],
      chartDataCopy: [2800, 2920, 2880, 2950, 3020, 2980, 3100, 3150, 3080, 3200, 3280, 3350, 3420, 3380, 3480, 3550, 3680, 3780],
      chartDataManual: [1200, 1180, 1220, 1250, 1210, 1240, 1280, 1260, 1290, 1310, 1280, 1320, 1350, 1330, 1360, 1380, 1350, 1420],
      
      // Dados das melhores IAs
      topIAs: [
        { name: 'IA Orion', value: '340', percentage: '7,8' },
        { name: 'IA Alpha', value: '280', percentage: '6,3' },
        { name: 'IA Hydra', value: '230', percentage: '5,4' },
        { name: 'IA Nova', value: '210', percentage: '5,0' },
        { name: 'IA Vega', value: '190', percentage: '4,8' }
      ]
    }
  },
  computed: {
    formattedBalance() {
      const value = this.balanceNumeric
      return `${this.currencyPrefix}${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`
    },
    potentialValue() {
      const base = this.balanceNumeric
      const projected = base * 0.12
      return projected.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    },
    currencyPrefix() {
      return this.info?.currencyPrefix || this.getCurrencyPrefix(this.info?.currency)
    },
    preferredCurrencyPrefix() {
      return this.info?.preferredCurrencyPrefix || this.currencyPrefix
    },
    balanceNumeric() {
      const raw = this.info?.balance
      if (typeof raw === 'number') return raw
      if (typeof raw === 'string') {
        const parsed = Number(raw)
        return isNaN(parsed) ? 0 : parsed
      }
      const val = raw?.value ?? raw?.balance ?? 0
      const num = Number(val)
      return isNaN(num) ? 0 : num
    },
    completedChallengesCount() {
      let count = 1; 
      if (this.challenges.deposit) {
        count++;
      }
      if (this.challenges.activateAI) {
        count++;
      }
      return count;
    },
    challengeProgress() {
      return Math.min(100, (this.completedChallengesCount / this.totalChallenges) * 100);
    }
  },
  methods: {
    completeChallenge(challengeName) {
      this.challenges[challengeName] = true;
    },
    getCurrencyPrefix(currency) {
      switch ((currency || '').toUpperCase()) {
        case 'USD':
          return '$'
        case 'EUR':
          return '€'
        case 'BTC':
          return '₿'
        case 'DEMO':
          return 'D$'
        default:
          return currency ? `${currency} ` : ''
      }
    },
  }
}
</script>

<style scoped src="../assets/css/views/DashboardConnected.css"></style>