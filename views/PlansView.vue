<template>
  <div class="layout">
    <AppSidebar />
    <main class="plans-content">
      <!-- Video Section -->
      <div class="video-section">
        <div class="video-container">
          <div class="video-placeholder" @click="playVideo">
            <div v-if="!isPlaying" class="play-button">
              <span>▶</span>
            </div>
            <div v-else class="video-player">
              <p>Player de vídeo será integrado aqui</p>
            </div>
          </div>
        </div>
        <div class="video-info">
          <h2 class="video-title">Marcos Explica os Planos Zenix <span class="video-badge">2 min</span></h2>

          <p class="video-description">
            Assista em 2 min e entenda qual plano se encaixa melhor no seu perfil de operação e resultado.
          </p>
        </div>
      </div>

      <!-- Plans Section -->
      <div class="plans-section">
        <h2 class="section-title">Escolha seu plano e evolua dentro da Zenix</h2>
        <p class="section-subtitle">Cada plano foi desenhado para um nível de operação. Compare e escolha o seu.</p>

        <div v-if="loading" class="loading">Carregando planos...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else class="plans-grid">
          <div 
            v-for="plan in plans" 
            :key="plan.id"
            class="plan-card"
            :class="{ popular: plan.isPopular, recommended: plan.isRecommended }"
          >
            <div v-if="plan.isPopular" class="plan-badge popular-badge">Mais Popular</div>
            <div v-if="plan.isRecommended" class="plan-badge recommended-badge">
              <span>👑</span> Recomendado
            </div>

            <h3 class="plan-name">{{ plan.name }}</h3>
            <div class="plan-price">
              <span v-if="plan.price === 0" class="price-free">Gratuito</span>
              <span v-else>
                <span class="currency">R$</span>
                <span class="amount">{{ plan.price }}</span>
                <span class="period">/mês</span>
              </span>
            </div>

            <ul class="plan-features">
              <li v-for="(value, key) in getPlanFeatures(plan)" :key="key" class="feature-item">
                <span v-if="isFeatureEnabled(value)" class="feature-icon check">✓</span>
                <span v-else-if="value === false" class="feature-icon cross">✗</span>
                <span v-else class="feature-text">{{ formatFeature(key, value) }}</span>
              </li>
            </ul>

            <button 
              class="plan-button"
              :class="{ 
                active: currentPlan?.id === plan.id,
                upgrade: plan.price > 0 && (!currentPlan || currentPlan.id !== plan.id)
              }"
              @click="handlePlanAction(plan)"
              :disabled="activating"
            >
              <span v-if="currentPlan?.id === plan.id">Plano atual</span>
              <span v-else-if="plan.price === 0">Ativar plano básico</span>
              <span v-else-if="currentPlan && plan.price > currentPlan.price">
                Fazer Upgrade <span>↑</span>
              </span>
              <span v-else>Escolher plano</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Comparison Table -->
      <div class="comparison-section">
        <h2 class="section-title">
          <span>📊</span> Compare os Planos
        </h2>
        <div class="table-container">
          <table class="comparison-table">
            <thead>
              <tr>
                <th class="plan-name">Funcionalidade</th>
                <th v-for="plan in plans" :key="plan.id">{{ plan.name }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="plan-name">IA Orion</td>
                <td v-for="plan in plans" :key="plan.id">
                  {{ formatFeatureValue(plan.features?.orion_ai) }}
                </td>
              </tr>
              <tr>
                <td class="plan-name">Copy Trading</td>
                <td v-for="plan in plans" :key="plan.id">
                  <span v-if="plan.features?.copy_trading === false" class="icon-cross">✗</span>
                  <span v-else-if="plan.features?.copy_trading === true" class="icon-check">✓</span>
                  <span v-else-if="plan.features?.copy_trading === 'premium'" class="icon-star">⭐</span>
                  <span v-else>-</span>
                </td>
              </tr>
              <tr>
                <td class="plan-name">Academy</td>
                <td v-for="plan in plans" :key="plan.id">
                  {{ formatFeatureValue(plan.features?.academy) }}
                </td>
              </tr>
              <tr>
                <td class="plan-name">Suporte</td>
                <td v-for="plan in plans" :key="plan.id">
                  {{ formatFeatureValue(plan.features?.support) }}
                </td>
              </tr>
              <tr>
                <td class="plan-name">Sinais Diários</td>
                <td v-for="plan in plans" :key="plan.id">
                  {{ plan.features?.signals_per_day || '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="table-footer">
          <span class="footer-bullet">•</span>
          Todos os planos incluem segurança avançada Deriv API e suporte Zenix.
        </p>
      </div>
    </main>
  </div>
</template>

<script>
import AppSidebar from '../components/Sidebar.vue'

export default {
  name: 'PlansView',
  components: { AppSidebar },
  data() {
    return {
      plans: [],
      currentPlan: null,
      loading: true,
      error: null,
      activating: false,
      isPlaying: false
    }
  },
  mounted() {
    this.fetchPlans()
    this.fetchCurrentPlan()
  },
  methods: {
    async fetchPlans() {
      this.loading = true
      this.error = null
      try {
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
        const res = await fetch(`${apiBaseUrl}/plans`)
        
        if (!res.ok) {
          throw new Error('Erro ao buscar planos')
        }

        this.plans = await res.json()
      } catch (err) {
        console.error('Erro ao buscar planos:', err)
        this.error = 'Não foi possível carregar os planos.'
      } finally {
        this.loading = false
      }
    },
    async fetchCurrentPlan() {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
        const res = await fetch(`${apiBaseUrl}/plans/user/current`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (res.ok) {
          this.currentPlan = await res.json()
        }
      } catch (err) {
        console.warn('Erro ao buscar plano atual:', err)
      }
    },
    async handlePlanAction(plan) {
      if (this.currentPlan?.id === plan.id) {
        return // Já está ativo
      }

      if (plan.price === 0) {
        // Plano gratuito
        await this.activatePlan(plan.id)
      } else {
        // Plano pago - mostrar mensagem ou redirecionar para pagamento
        alert(`O plano ${plan.name} requer processamento de pagamento. Funcionalidade em desenvolvimento.`)
      }
    },
    async activatePlan(planId) {
      this.activating = true
      try {
        const token = localStorage.getItem('token')
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
        
        const res = await fetch(`${apiBaseUrl}/plans/activate`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ planId })
        })

        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.message || 'Erro ao ativar plano')
        }

        await this.fetchCurrentPlan()
        alert('Plano ativado com sucesso!')
      } catch (err) {
        alert(err.message || 'Erro ao ativar plano')
      } finally {
        this.activating = false
      }
    },
    getPlanFeatures(plan) {
      const features = {}
      if (plan.features?.orion_ai) {
        features['IA Orion'] = plan.features.orion_ai === 'limitada' ? 'limitada' : 
                               plan.features.orion_ai === 'completa' ? true :
                               plan.features.orion_ai === 'black_module' ? 'Black Module' : true
      }
      if (plan.features?.signals_per_day !== undefined) {
        features['Sinais/dia'] = plan.features.signals_per_day
      }
      if (plan.features?.copy_trading !== undefined) {
        features['Copy Trading'] = plan.features.copy_trading
      }
      if (plan.features?.academy) {
        features['Academy'] = plan.features.academy
      }
      if (plan.features?.support) {
        features['Suporte'] = plan.features.support
      }
      if (plan.features?.dashboards) {
        features['Dashboards Avançados'] = plan.features.dashboards
      }
      return features
    },
    isFeatureEnabled(value) {
      return value === true
    },
    formatFeature(key, value) {
      if (value === true) return key
      if (value === false) return `Sem ${key}`
      if (typeof value === 'string') {
        if (key === 'IA Orion') {
          if (value === 'limitada') return 'IA Orion limitada'
          if (value === 'completa') return 'IA Orion completa'
          if (value === 'black_module') return 'IA Orion Black Module'
        }
        if (key === 'Academy') {
          if (value === 'limitada') return 'Academy limitada'
          if (value === 'completa') return 'Zenix Academy inclusa'
          if (value === 'black_edition') return 'Academy Black Edition'
        }
        if (key === 'Suporte') {
          if (value === 'email') return 'Suporte por e-mail'
          if (value === 'prioritario') return 'Suporte prioritário'
          if (value === '1on1') return 'Suporte 1:1 com Equipe'
        }
        if (key === 'Sinais/dia') {
          return `${value} sinais/dia`
        }
        return value
      }
      return String(value)
    },
    formatFeatureValue(value) {
      if (value === false) return '-'
      if (value === true) return '✓'
      if (typeof value === 'string') {
        if (value === 'limitada') return 'Limitada'
        if (value === 'completa') return 'Completa'
        if (value === 'black_module') return 'Black Module'
        if (value === 'black_edition') return 'Black Edition'
        if (value === 'email') return 'E-mail'
        if (value === 'prioritario') return 'Prioritário'
        if (value === '1on1') return '1:1'
        return value
      }
      return String(value)
    },
    playVideo() {
      this.isPlaying = true
    }
  }
}
</script>

<style scoped src="../assets/css/views/plansView.css"></style>

