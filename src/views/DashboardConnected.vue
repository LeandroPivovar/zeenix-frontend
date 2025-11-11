<template>
  <main class="dash-content">
    <div class="background-glow"></div>
    <div class="background-grid"></div>

    <div class="cards">
      <transition-group name="fade-up" tag="div" class="cards-stack">
        <div class="balance-card" key="balance" data-index="0">
          <div class="row">
            <div class="dot"></div>
            <div class="metric">
              <div class="label">Saldo Atual</div>
              <div class="balances-row">
                <div class="balance-item">
                  <span class="balance-currency">USD Real</span>
                  <span class="balance-value">${{ formatBalance(usdBalance || 0) }}</span>
                </div>
                <div class="balance-item">
                  <span class="balance-currency">USD Demo</span>
                  <span class="balance-value">${{ formatBalance(usdDemoBalance || 0) }}</span>
                </div>
                <div class="balance-item">
                  <span class="balance-currency">BTC</span>
                  <span class="balance-value">₿{{ formatBalance(btcBalance || 0, 8) }}</span>
                </div>
              </div>
            </div>
            <div class="metric right">
              <div class="label">Potencial mensal estimado</div>
              <div class="value green">
                +{{ preferredCurrencyPrefix }}{{ potentialValue }}/mês
                <span class="desktop-value-span">(com IA ativa)</span>
                <span class="mobile-value-span">IA ativa</span>
              </div>
            </div>
            <div class="spacer"></div>
            <button class="cta" @mouseenter="playButtonSound">
              <img src="../assets/icons/add-black.svg" alt="Aumentar minha banca" class="icon-dashboard">
              Aumentar minha banca
            </button>
          </div>
          <div class="hint">Capital ocioso é lucro desperdiçado. Mantenha sua IA abastecida.</div>
        </div>

        <div class="level-card" key="level" data-index="1">
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

        <div class="features" key="features" data-index="2">
          <div class="feature" v-for="(feature, index) in featureList" :key="`feature-${index}`" :style="getDelayStyle(index)">
            <div class="feature-glow"></div>
            <div class="f-img"><span class="icon-feature">{{ feature.icon }}</span></div>
            <div class="f-title">{{ feature.title }}</div>
            <div class="f-sub">{{ feature.subtitle }}</div>
            <div class="f-text">{{ feature.text }}</div>
            <button class="f-btn" @click="handleFeatureClick(feature)">{{ feature.cta }}</button>
          </div>
        </div>

        <div class="projection" key="projection" data-index="3">
          <div class="p-title">
            <span>📈</span>
            Potencial de Ganhos (Projeção Futura)
          </div>
          <div class="p-sub">Com seu saldo atual de {{ formattedBalance }}, sua IA Orion pode gerar até <span class="green">+{{ preferredCurrencyPrefix }}{{ potentialValue }}/mês</span></div>
          <div class="p-subtext">Com +$500 de depósito, o potencial sobe para <span class="yellow">+$2.780/mês</span></div>
          <div class="p-saldo">
            <div class="p-saldo-atual">Atual: {{ formattedBalance }}</div>
            <div class="spacer"></div>
            <div class="p-saldo-projetado">Com 500 + 2180</div>
          </div>
          <button class="projection-btn">
            <img src="../assets/icons/up-arrow.svg" alt="" class="icon-dashboard">
            Aumentar Capital e Liberar Potencial
          </button>
        </div>

        <div class="community" key="community" data-index="4">
          <div class="c-title">
            <span>🌍</span>
            Comunidade Zenix Black Hoje
          </div>
          <div class="c-cards">
            <div class="c-card" v-for="(card, index) in communityStats" :key="`community-${index}`">
              <h2 class="c-card-title">{{ card.value }}</h2>
              <h4>{{ card.label }}</h4>
              <div class="progress-bar-container">
                <div class="progress-bar-fill" :style="{ width: card.progress }"></div> 
              </div>
            </div>
          </div>
          <div class="c-footer">
            <h3>Você faz parte da elite que lucra em dolar. Amplie seu capital e avance de nível.</h3>
          </div>
        </div>

        <div class="daily-challenge-card" key="challenge" data-index="5">
          <div class="glow-ring"></div>
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
            <div class="challenge-progress-fill" :style="{ width: challengeProgress + '%' }"></div>
          </div>

          <div class="challenge-footer">
            Consistência é a chave para liberar novos bônus.
          </div>
        </div>

        <div class="graphic-cards" key="graphics" data-index="6">
          <div class="g-card" v-for="(card, idx) in performanceCards" :key="card.title" :style="getDelayStyle(idx)">
            <h2 class="g-card-title">{{ card.title }}</h2>
            <h4 class="g-card-subtitle">{{ card.subtitle }}</h4>
            <div class="graphic">
              <LineChart :chartId="card.id" :data="card.data" :color="card.color" :height="80" />
            </div>
          </div>
        </div>
      </transition-group>

      <div class="best-ias-card" key="best-ias">
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
import LineChart from '../components/LineChart.vue';

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
      challenges: {
        deposit: false,
        activateAI: false,
      },
      totalChallenges: 3,
      featureList: [
        {
          icon: '🧠',
          title: 'IA de Investimento',
          subtitle: 'Sua IA opera 24h — quanto mais saldo, mais potencial.',
          text: 'A IA trabalha para você. Quanto maior o capital, mais oportunidades ela aproveita',
          cta: 'Ativar IA Agora',
        },
        {
          icon: '👥',
          title: 'Copy Trading',
          subtitle: 'Lucro com quem já vence.',
          text: '++1.372 usuários ativos hoje replicando traders verificados',
          cta: 'Escolher Trader',
        },
        {
          icon: '⚙️',
          title: 'Operação Manual',
          subtitle: 'Controle o mercado nas suas mãos.',
          text: 'Analise, opere e maximize seu potencial - o saldo ativo define seu alcance',
          cta: 'Operar Agora',
        },
      ],
      communityStats: [
        { value: '+1.372', label: 'usuários ativos', progress: '70%' },
        { value: '$184.000', label: 'depositados nas últimas 24h', progress: '80%' },
        { value: '+248', label: 'Novas ativações de IA', progress: '65%' },
      ],
      chartDataAI: [
        3200, 3350, 3280, 3420, 3550, 3480, 3650, 3720, 3650, 3800, 3850, 3920, 4050, 4120, 4280, 4350, 4520, 4650
      ],
      chartDataCopy: [
        2800, 2920, 2880, 2950, 3020, 2980, 3100, 3150, 3080, 3200, 3280, 3350, 3420, 3380, 3480, 3550, 3680, 3780
      ],
      chartDataManual: [
        1200, 1180, 1220, 1250, 1210, 1240, 1280, 1260, 1290, 1310, 1280, 1320, 1350, 1330, 1360, 1380, 1350, 1420
      ],
      topIAs: [
        { name: 'Orion AI', value: '1.250', percentage: '12.5' },
        { name: 'Nexus Pro', value: '980', percentage: '9.8' },
        { name: 'Quantum Trade', value: '750', percentage: '7.5' },
        { name: 'Alpha Bot', value: '620', percentage: '6.2' },
      ],
    };
  },
  computed: {
    formattedBalance() {
      const value = this.balanceNumeric;
      return `${this.currencyPrefix}${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`;
    },
    potentialValue() {
      const base = this.balanceNumeric;
      const projected = base * 0.12;
      return projected.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    },
    currencyPrefix() {
      return this.info?.currencyPrefix || this.getCurrencyPrefix(this.info?.currency);
    },
    preferredCurrencyPrefix() {
      return this.info?.preferredCurrencyPrefix || this.currencyPrefix;
    },
    balanceNumeric() {
      // Usar apenas saldo REAL para cálculos (não incluir demo)
      // Priorizar USD real, senão usar o saldo principal se for real
      const usdReal = this.balancesByCurrencyReal['USD'];
      if (usdReal !== undefined && usdReal !== null && usdReal > 0) {
        return usdReal;
      }
      
      // Fallback: usar o saldo principal se não houver separação
      const raw = this.info?.balance;
      if (typeof raw === 'number') return raw;
      if (typeof raw === 'string') {
        const parsed = Number(raw);
        return isNaN(parsed) ? 0 : parsed;
      }
      const val = raw?.value ?? raw?.balance ?? 0;
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    },
    balancesByCurrency() {
      return this.info?.balancesByCurrency || {};
    },
    balancesByCurrencyDemo() {
      return this.info?.balancesByCurrencyDemo || {};
    },
    balancesByCurrencyReal() {
      return this.info?.balancesByCurrencyReal || {};
    },
    usdBalance() {
      // Mostrar saldo USD REAL
      return this.balancesByCurrencyReal['USD'] ?? 0;
    },
    usdDemoBalance() {
      // Mostrar saldo USD DEMO
      return this.balancesByCurrencyDemo['USD'] ?? 0;
    },
    btcBalance() {
      // Mostrar saldo BTC real (ou total se não houver separação)
      const real = this.balancesByCurrencyReal['BTC'];
      if (real !== undefined && real !== null) return real;
      return this.balancesByCurrency['BTC'] ?? 0;
    },
    performanceCards() {
      return [
        { id: 'chart-ai', title: 'IA de investimento', subtitle: '+$450 (6,2%)', data: this.chartDataAI, color: '#10B981' },
        { id: 'chart-copy', title: 'Copy Trading', subtitle: '+$380 (5,1%)', data: this.chartDataCopy, color: '#10B981' },
        { id: 'chart-manual', title: 'Operação Manual', subtitle: '+$120 (2,8%)', data: this.chartDataManual, color: '#10B981' },
      ];
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
    formatBalance(value, decimals = 2) {
      if (value === null || value === undefined || value === 0) {
        return '0.' + '0'.repeat(decimals);
      }
      const num = Number(value);
      if (isNaN(num) || num === 0) {
        return '0.' + '0'.repeat(decimals);
      }
      return num.toLocaleString('en-US', { 
        minimumFractionDigits: decimals, 
        maximumFractionDigits: decimals 
      });
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
    getDelayStyle(index) {
      const delay = 0.08 * index;
      return { animationDelay: `${delay}s`, transitionDelay: `${delay}s` };
    },
    handleFeatureClick(feature) {
      if (feature.cta === 'Operar Agora') {
        this.$router.push('/operation');
      }
      // Outros cards podem ter ações diferentes no futuro
    },
    playButtonSound() {
      const audio = new Audio('data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCAZGF0YQAAAAA=');
      audio.volume = 0.15;
      audio.play().catch(() => {});
    }
  }
}
</script>

<style scoped src="../assets/css/views/DashboardConnected.css"></style>
<style scoped>
.background-glow {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at 15% 20%, rgba(99, 102, 241, 0.22), transparent 45%),
    radial-gradient(circle at 80% 15%, rgba(56, 189, 248, 0.18), transparent 50%),
    radial-gradient(circle at 50% 75%, rgba(16, 185, 129, 0.18), transparent 55%),
    rgba(9, 10, 12, 0.95);
  z-index: -2;
  pointer-events: none;
}

.background-grid {
  position: fixed;
  inset: 0;
  background-image: linear-gradient(rgba(148, 163, 184, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.06) 1px, transparent 1px);
  background-size: 48px 48px;
  z-index: -1;
  opacity: 0.6;
  pointer-events: none;
  animation: moveGrid 18s linear infinite;
}

@keyframes moveGrid {
  0% {
    background-position: 0 0, 0 0;
  }
  100% {
    background-position: -48px -48px, -48px -48px;
  }
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.6s ease;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(24px);
}

/* Animações de entrada para os cards */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Aplicar animação baseada no data-index */
.balance-card[data-index="0"] {
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
}

.level-card[data-index="1"] {
  animation: slideInUp 0.6s ease-out 0.1s forwards;
  opacity: 0;
}

.features[data-index="2"] {
  animation: fadeInScale 0.7s ease-out 0.2s forwards;
  opacity: 0;
}

.projection[data-index="3"] {
  animation: slideInUp 0.6s ease-out 0.3s forwards;
  opacity: 0;
}

.community[data-index="4"] {
  animation: fadeInScale 0.7s ease-out 0.4s forwards;
  opacity: 0;
}

.daily-challenge-card[data-index="5"] {
  animation: slideInUp 0.6s ease-out 0.5s forwards;
  opacity: 0;
}

.graphic-cards[data-index="6"] {
  animation: fadeInScale 0.7s ease-out 0.6s forwards;
  opacity: 0;
}

/* Animações para cards dentro de grupos */
.feature {
  position: relative;
  overflow: hidden;
  animation: slideInUp 0.5s ease-out forwards;
  opacity: 0;
}

.feature:nth-child(1) {
  animation-delay: 0.7s;
}

.feature:nth-child(2) {
  animation-delay: 0.8s;
}

.feature:nth-child(3) {
  animation-delay: 0.9s;
}

.g-card {
  animation: slideInUp 0.5s ease-out forwards;
  opacity: 0;
}

.g-card:nth-child(1) {
  animation-delay: 1.0s;
}

.g-card:nth-child(2) {
  animation-delay: 1.1s;
}

.g-card:nth-child(3) {
  animation-delay: 1.2s;
}

.c-card {
  animation: fadeInScale 0.5s ease-out forwards;
  opacity: 0;
}

.c-card:nth-child(1) {
  animation-delay: 0.8s;
}

.c-card:nth-child(2) {
  animation-delay: 0.9s;
}

.c-card:nth-child(3) {
  animation-delay: 1.0s;
}

/* Animação para o card de melhores IAs */
.best-ias-card {
  animation: slideInUp 0.6s ease-out 0.7s forwards;
  opacity: 0;
}

.ia-item {
  animation: fadeInScale 0.4s ease-out forwards;
  opacity: 0;
}

.ia-item:nth-child(1) {
  animation-delay: 1.3s;
}

.ia-item:nth-child(2) {
  animation-delay: 1.4s;
}

.ia-item:nth-child(3) {
  animation-delay: 1.5s;
}

.ia-item:nth-child(4) {
  animation-delay: 1.6s;
}

/* Transições suaves para hover */
.balance-card,
.level-card,
.feature,
.projection,
.community,
.daily-challenge-card,
.g-card,
.best-ias-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.balance-card:hover,
.level-card:hover,
.feature:hover,
.projection:hover,
.community:hover,
.daily-challenge-card:hover,
.g-card:hover,
.best-ias-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.15);
}

.feature-glow {
  position: absolute;
  inset: -40% -40% auto auto;
  width: 160px;
  height: 160px;
  pointer-events: none;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.32), transparent 60%);
  transition: transform 0.4s ease, opacity 0.4s ease;
}

.feature:hover .feature-glow {
  transform: translate(12px, -12px) scale(1.1);
  opacity: 0.8;
}

.glow-ring {
  position: absolute;
  inset: 12px;
  border-radius: 20px;
  border: 1px solid rgba(99, 102, 241, 0.2);
  box-shadow: 0 0 18px rgba(99, 102, 241, 0.18);
  pointer-events: none;
}
</style>