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
            <div class="spacer"></div>
            <div class="metric right">
              <div class="label">Potencial mensal estimado</div>
              <div class="value green">+${{ potential }}/mês (com IA ativa)</div>
            </div>
            <button class="cta">Aumentar minha banca</button>
          </div>
          <div class="hint">Capital ocioso é lucro desperdiçado. Mantenha sua IA abastecida.</div>
        </div>

        <div class="level-card">
          <div class="title">Nível de investidor: <strong>Bronze</strong> → Próximo: <strong>Silver</strong></div>
          <div class="subtitle">Faltam $320 de saldo para desbloquear novos limites.</div>
          <button class="link">Ver benefícios do próximo nível</button>
        </div>

        <div class="features">
          <div class="feature">
            <div class="f-title">IA de Investimento</div>
            <div class="f-sub">Sua IA opera 24h — quanto mais saldo, mais potencial.</div>
            <button class="primary">Ativar IA Agora</button>
          </div>
          <div class="feature">
            <div class="f-title">Copy Trading</div>
            <div class="f-sub">Lucro com quem já vence.</div>
            <button class="secondary">Escolher Trader</button>
          </div>
          <div class="feature">
            <div class="f-title">Operação Manual</div>
            <div class="f-sub">Controle o mercado nas suas mãos.</div>
            <button class="secondary">Operar Agora</button>
          </div>
        </div>

        <div class="projection">
          <div class="p-title">Potencial de Ganhos (Projeção Futura)</div>
          <div class="p-sub">Com seu saldo atual de {{ formattedBalance }}, sua IA Orion pode gerar até <span class="green">+${{ potential }}/mês</span></div>
          <button class="primary wide">Aumentar Capital e Liberar Potencial</button>
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
      // Se vier do DB como string (ex.: decimal de cripto), não converter para Number para evitar perda de precisão
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

<style scoped>
.dash-content { flex: 1; padding: 20px; background: #000000; color: #e5e7eb; min-height: 100vh; }
.cards { max-width: 1100px; margin: 0 auto; display: grid; gap: 16px; }
.balance-card { background: #0f1411; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 16px; }
.row { display: grid; grid-template-columns: 20px auto 1fr auto auto; gap: 12px; align-items: center; }
.dot { width: 12px; height: 12px; border-radius: 50%; background: #22c55e; }
.metric .label { font-size: 12px; color: #9ca3af; }
.metric .value { font-weight: 700; font-size: 20px; }
.metric .value.green { color: #10B981; font-weight: 700; }
.cta { margin-left: 16px; background: transparent; border: 1px solid #22c55e; color: #86efac; border-radius: 9999px; padding: 8px 12px; cursor: pointer; }
.hint { font-size: 10px; color: #9ca3af; margin-top: 6px; text-align: right; }

.level-card { background: #0f1411; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 16px; }
.level-card .title { font-weight: 600; }
.level-card .subtitle { font-size: 12px; color: #9ca3af; margin-top: 4px; }
.level-card .link { margin-top: 8px; background: transparent; color: #86efac; border: none; text-decoration: underline; cursor: pointer; }

.features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.feature { background: #0f1411; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 16px; text-align: center; }
.f-title { font-weight: 700; }
.f-sub { font-size: 12px; color: #9ca3af; margin: 6px 0 12px; }
.primary { background: #10B981; color: #04130b; border: none; border-radius: 10px; padding: 10px 16px; font-weight: 700; cursor: pointer; }
.secondary { background: transparent; border: 1px solid #22c55e; color: #86efac; border-radius: 10px; padding: 10px 16px; cursor: pointer; }
.primary.wide { width: 100%; margin-top: 12px; }

.projection { background: #0f1411; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 16px; }
.p-title { font-weight: 700; }
.p-sub { margin-top: 6px; color: #9ca3af; }
.green { color: #10B981; font-weight: 700; }
@media (max-width: 1000px) { .features { grid-template-columns: 1fr; } .row { grid-template-columns: 12px 1fr auto; } .cta { grid-column: 1 / -1; justify-self: end; } }
</style>


