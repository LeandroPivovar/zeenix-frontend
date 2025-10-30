<template>
  <div v-if="visible" class="overlay" @click.self="onClose">
    <div class="modal">
      <h3 class="title">Conectar à Corretora (Deriv)</h3>
      <p class="hint">Informe seu Token de Autenticação Deriv para conectar.</p>

      <div class="form">
        <label for="token">Token de API</label>
        <input id="token" type="password" v-model="token" :disabled="loading" placeholder="Cole seu token aqui" />

        <label for="appId">App ID (opcional)</label>
        <input id="appId" type="number" v-model.number="appId" :disabled="loading" placeholder="1089" />

        <button class="primary" @click="connect" :disabled="loading || !token">
          <span v-if="loading" class="spinner"></span>
          <span>{{ loading ? 'Conectando...' : 'Conectar' }}</span>
        </button>
      </div>

      <div v-if="error" class="error">{{ error }}</div>

      <div v-if="account" class="success">
        Conectado! ID: <strong>{{ account.loginid }}</strong> — Saldo: <strong>{{ account.balance?.value }} {{ account.currency }}</strong>
      </div>

      <button class="close" @click="onClose">Fechar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConnectBrokerModal',
  props: { visible: { type: Boolean, default: false } },
  emits: ['close', 'connected'],
  data() {
    return {
      token: localStorage.getItem('deriv_token') || '',
      appId: Number(localStorage.getItem('deriv_app_id')) || 1089,
      loading: false,
      error: '',
      account: null
    }
  },
  methods: {
    onClose() { this.$emit('close') },
    async connect() {
      if (this.loading) return
      this.loading = true
      this.error = ''
      this.account = null
      try {
        const res = await fetch((process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000') + '/broker/deriv/connect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
          body: JSON.stringify({ token: this.token, appId: this.appId })
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err?.message || 'Falha ao conectar ao backend')
        }
        const account = await res.json()
        this.account = account
        localStorage.setItem('deriv_token', this.token)
        localStorage.setItem('deriv_app_id', String(this.appId))
        this.$emit('connected', account)
      } catch (e) {
        this.error = e?.message || 'Falha ao conectar à Deriv'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped src="../assets/css/components/connectBrokerModal.css"></style>


