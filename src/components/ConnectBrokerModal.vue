<template>
  <div v-if="visible" class="overlay" @click.self="onClose">
    <div class="modal">
      <h3 class="title">Conectar a corretora</h3>
      <p class="hint">Você será redirecionado para o site da Deriv para autorizar o acesso.</p>

      <div class="form">
        <button class="primary" @click="startOAuth" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span v-else>Continuar com Deriv OAuth</span>
        </button>
      </div>

      <div v-if="error" class="error">{{ error }}</div>

      <button class="close" @click="onClose" :disabled="loading">Fechar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConnectBrokerModal',
  props: { visible: { type: Boolean, default: false } },
  emits: ['close'],
  data() {
    return {
      loading: false,
      error: '',
    };
  },
  methods: {
    onClose() {
      if (this.loading) return;
      this.$emit('close');
    },
    generateState() {
      if (window.crypto?.getRandomValues) {
        const array = new Uint32Array(4);
        window.crypto.getRandomValues(array);
        return Array.from(array, value => value.toString(16)).join('');
      }
      return Math.random().toString(16).slice(2);
    },
    async startOAuth() {
      if (this.loading) return;
      this.loading = true;
      this.error = '';
      try {
        const state = this.generateState();
        localStorage.setItem('deriv_oauth_state', state);
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${apiBase}/broker/deriv/oauth/url?state=${state}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.message || 'Não foi possível iniciar o OAuth');
        }
        const data = await res.json();
        if (!data?.url) {
          throw new Error('URL de OAuth não recebida');
        }
        window.location.href = data.url;
      } catch (error) {
        this.error = error?.message || 'Falha ao iniciar OAuth. Tente novamente.';
        this.loading = false;
        localStorage.removeItem('deriv_oauth_state');
      }
    },
  },
};
</script>

<style scoped src="../assets/css/components/connectBrokerModal.css"></style>
