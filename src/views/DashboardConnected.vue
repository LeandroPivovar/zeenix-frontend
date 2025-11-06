<template>
  <main class="dash-content">
      <div class="cards">
        <div class="balance-card">
          <div class="row">
            <div class="dot"></div>
            <div class="metric">
              <div class="label">Saldo Atual</div>
              <div class="value">{{ formattedBalance }}</div>
            </div>
            <div class="metric right">
              <div class="label">Potencial mensal estimado</div>
              <div class="value green">+${{ potential }}/mês <span class="desktop-value-span">(com IA ativa)</span> <span class="mobile-value-span">IA ativa</span></div>
            </div>
            <div class="spacer"></div>
            <button class="cta">
              <img src="../assets/icons/add-black.svg" alt="Aumentar minha banca" class="icon-dashboard">
              Aumentar minha banca

            </button>
          </div>
          <div class="hint">Capital ocioso é lucro desperdiçado. Mantenha sua IA abastecida.</div>
        </div>

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

        <div class="projection">
          <div class="p-title">
            <span>📈</span>
            Potencial de Ganhos (Projeção Futura)
          </div>
          <div class="p-sub">Com seu saldo atual de {{ formattedBalance }}, sua IA Orion pode gerar até <span class="green">+${{ potential }}/mês</span></div>
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
      </div>
  </main>
</template>

<script>
export default {
  name: 'DashboardConnected',
  props: { info: { type: Object, required: true } },
  computed: {
    formattedBalance() {
      const cur = this.info?.currency || 'USD'
      const raw = (this.info && this.info.balance != null) ? this.info.balance : null
      if (typeof raw === 'string') {
        return `${raw} ${cur}`
      }
      const val = this.info?.balance?.value ?? this.info?.balance?.balance ?? 0
      return `${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })} ${cur}`
    },
    potential() {
      const base = (typeof this.info?.balance === 'string') ? Number(this.info.balance) : Number(this.info?.balance?.value || this.info?.balance?.balance || 0)
      const val = isNaN(base) ? 0 : base
      return (val * 0.12).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    }
  }
}
</script>

<style scoped src="../assets/css/views/DashboardConnected.css"></style>